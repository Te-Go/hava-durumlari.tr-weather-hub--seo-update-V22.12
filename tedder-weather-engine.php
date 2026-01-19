<?php
/**
 * TEDDER WEATHER ENGINE (SEO CORE)
 * 
 * Responsible for:
 * 1. Freshness Engine: Programmatic `lastmod` updates based on significant weather changes.
 * 2. LiteSpeed Cache Purge: Triggering cache clear only when necessary.
 * 3. Kill Switch: Preventing "Live" schema on stale data (Soft 404 protection).
 * 4. Logging: Tracking SEO events for debugging.
 */

class TedderWeatherEngine
{
    private $log_file;
    private $throttle_duration = 900; // 15 Minutes in seconds
    private $significant_temp_diff = 2.0; // 2°C change triggers update

    public function __construct()
    {
        $this->log_file = dirname(__FILE__) . '/seo_events.log';
    }

    /**
     * CORE: Checks if weather data change warrants an SEO update
     * @param int $post_id WordPress Post ID
     * @param array $old_data Previous weather data packet
     * @param array $new_data Fresh API weather data packet
     */
    public function process_update($post_id, $old_data, $new_data)
    {
        // 1. KILL SWITCH CHECK
        if ($this->is_data_stale($new_data)) {
            $this->log("KILL SWITCH: Data stale for Post ID $post_id. Aborting update to prevent Soft 404.");
            return false;
        }

        // 2. THROTTLE CHECK
        $last_update = get_post_meta($post_id, '_tedder_last_seo_update', true);
        if ($last_update && (time() - $last_update < $this->throttle_duration)) {
            $this->log("THROTTLE: Update skipped for Post ID $post_id (Too soon).");
            return false;
        }

        // 3. SIGNIFICANCE CHECK
        if ($this->is_significant_change($old_data, $new_data)) {
            $this->log("FRESHNESS: Significant change detected for Post ID $post_id. Triggering flush.");
            $this->trigger_seo_update($post_id);
            return true;
        }

        return false;
    }

    /**
     * Determines if the data difference matches QDF (Query Deserves Freshness) criteria
     */
    private function is_significant_change($old, $new)
    {
        if (empty($old))
            return true; // First run

        // Condition 1: Temperature Swing > 2°C
        $temp_diff = abs($old['current_temp'] - $new['current_temp']);
        if ($temp_diff >= $this->significant_temp_diff)
            return true;

        // Condition 2: Weather Code Change (Sunny -> Rainy)
        if ($old['weather_code'] !== $new['weather_code'])
            return true;

        return false;
    }

    /**
     * Checks if API data is too old (> 2 hours)
     */
    private function is_data_stale($data)
    {
        if (!isset($data['timestamp']))
            return true;
        $age = time() - $data['timestamp'];
        return $age > 7200; // 2 Hours
    }

    /**
     * Executes the SEO Update Protocol
     */
    private function trigger_seo_update($post_id)
    {
        // A. Update WordPress "Modified Date"
        $current_time = current_time('mysql');
        wp_update_post(array(
            'ID' => $post_id,
            'post_modified' => $current_time,
            'post_modified_gmt' => get_gmt_from_date($current_time)
        ));

        // B. Update Internal Meta (for Throttling)
        update_post_meta($post_id, '_tedder_last_seo_update', time());

        // C. Purge LiteSpeed Cache
        if (class_exists('LiteSpeed_Cache_API')) {
            LiteSpeed_Cache_API::purge_post($post_id);
            $this->log("LITESPEED: Cache purged for Post ID $post_id");
        }

        $this->log("UPDATE: Post ID $post_id updated successfully.");
    }

    /**
     * Simple File Logger
     */
    private function log($message)
    {
        $timestamp = date('Y-m-d H:i:s');
        $entry = "[$timestamp] $message" . PHP_EOL;
        file_put_contents($this->log_file, $entry, FILE_APPEND);
    }
}

// Instantiate for global use
global $tedder_engine;
$tedder_engine = new TedderWeatherEngine();
