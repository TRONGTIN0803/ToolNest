<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('toolnest:about', function () {
    $this->comment('ToolNest API');
})->purpose('Show ToolNest API information');
