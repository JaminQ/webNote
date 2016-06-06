<?php

/**
 * PHP Console
 * @author JaminQian
 * @version 2016-05-06 16:13:10
 * @description A `Console` class like JavaScript console API, use PHP Filesystem
 *              to write console data with date to log file.
 *
 * @class Console
 * @parameters (string)$log_path
 *             (string)$log_file
 * @example
 * ```
 *     require('yourpath/class.console.php');
 *     $console = new Console($log_path, $log_file);
 *     $console->log('log');
 *     $console->warn('warn');
 *     $console->error('error');
 *     $console->info('info');
 *     $console->debug('debug');
 * ```
 * @result
 * ```
 *     [Log]   [16-05-06 16:44:12] log
 *     [Warn]  [16-05-06 16:44:12] warn
 *     [Error] [16-05-06 16:44:12] error
 *     [Info]  [16-05-06 16:44:12] info
 *     [Debug] [16-05-06 16:44:12] debug
 * ```
 * @todo 1)Add some interesting usage.
 $       2)Change file type to .log, make it more convenient to view on MacOS's console.
 */

class Console {
    private $log_path;
    private $log_file;
    private $file;
    private $fp;
    private $str;

    public function __construct($log_path, $log_file) {
        $this->log_path = $log_path;
        $this->log_file = $log_file;
        $this->file = $log_path . $log_file;
    }

    /***************************************************************
     * Public functions
     ***************************************************************/

    /**
     * @function log
     * @description To log something.
     * @parameters (string)$str
     *             [(bool) $if_clear], default value: false
     * @example
     * ```
     *     require('yourpath/class.console.php');
     *     $console = new Console($log_path, $log_file);
     *     $console->log('log');
     *     $console->log('log', true); // if you want to clear all data in the file, you can try it
     * ```
     * @result
     * ```
     *     [Log]   [16-05-06 16:44:12] log
     * ```
     */
    public function log($str, $if_clear = false) {
        $this->before_write($str, $if_clear);
        fwrite($this->fp, '[Log]   ' . date('[y-m-d H:i:s]') . ' ' . $this->str . "\n");
        fclose($this->fp);
    }

    /**
     * @function warn
     * @description To log some warn message.
     * @parameters (string)$str
     *             [(bool) $if_clear], default value: false
     * @example
     * ```
     *     require('yourpath/class.console.php');
     *     $console = new Console($log_path, $log_file);
     *     $console->warn('warn');
     *     $console->warn('warn', true); // if you want to clear all data in the file, you can try it
     * ```
     * @result
     * ```
     *     [Warn]   [16-05-06 16:44:12] warn
     * ```
     */
    public function warn($str, $if_clear = false) {
        $this->before_write($str, $if_clear);
        fwrite($this->fp, '[Warn]  ' . date('[y-m-d H:i:s]') . ' ' . $this->str . "\n");
        fclose($this->fp);
    }

    /**
     * @function error
     * @description To log some error message.
     * @parameters (string)$str
     *             [(bool) $if_clear], default value: false
     * @example
     * ```
     *     require('yourpath/class.console.php');
     *     $console = new Console($log_path, $log_file);
     *     $console->error('error');
     *     $console->error('error', true); // if you want to clear all data in the file, you can try it
     * ```
     * @result
     * ```
     *     [Error]   [16-05-06 16:44:12] error
     * ```
     */
    public function error($str, $if_clear = false) {
        $this->before_write($str, $if_clear);
        fwrite($this->fp, '[Error] ' . date('[y-m-d H:i:s]') . ' ' . $this->str . "\n");
        fclose($this->fp);
    }

    /**
     * @function info
     * @description To log some info message.
     * @parameters (string)$str
     *             [(bool) $if_clear], default value: false
     * @example
     * ```
     *     require('yourpath/class.console.php');
     *     $console = new Console($log_path, $log_file);
     *     $console->info('info');
     *     $console->info('info', true); // if you want to clear all data in the file, you can try it
     * ```
     * @result
     * ```
     *     [Info]   [16-05-06 16:44:12] info
     * ```
     */
    public function info($str, $if_clear = false) {
        $this->before_write($str, $if_clear);
        fwrite($this->fp, '[Info]  ' . date('[y-m-d H:i:s]') . ' ' . $this->str . "\n");
        fclose($this->fp);
    }

    /**
     * @function debug
     * @description To log some debug message.
     * @parameters (string)$str
     *             [(bool) $if_clear], default value: false
     * @example
     * ```
     *     require('yourpath/class.console.php');
     *     $console = new Console($log_path, $log_file);
     *     $console->debug('debug');
     *     $console->debug('debug', true); // if you want to clear all data in the file, you can try it
     * ```
     * @result
     * ```
     *     [Debug]   [16-05-06 16:44:12] debug
     * ```
     */
    public function debug($str, $if_clear = false) {
        $this->before_write($str, $if_clear);
        fwrite($this->fp, '[Debug] ' . date('[y-m-d H:i:s]') . ' ' . $this->str . "\n");
        fclose($this->fp);
    }

    /***************************************************************
     * Helpers
     ***************************************************************/

    // check if the path exist
    private function check_path() {
        if (!file_exists($this->log_path)) { // if the path is not exist, then creat it, skip otherwise
            mkdir($this->log_path);
        }
    }

    // to do something before write data to file
    private function before_write($str, $if_clear) {
        if (!is_string($str)) { // if the type of parameter `$str` is not `string`, then encode it into `string` type, store its value in property `str` otherwise
            $this->str = json_encode($str);
        } else {
            $this->str = $str;
        }

        $this->check_path();

        $this->fp = fopen($this->file, 'a');

        if ($if_clear) { // if the value of parameter `$if_clear` is `true`, then clear all data in the file, skip otherwise
            file_put_contents($this->file, '');
        }
    }
} // END

/* END file */
?>