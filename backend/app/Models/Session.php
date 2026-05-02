<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\School;

class Session extends Model
{
    //
    public $timestamps = false;

    public $table = 'sessions';

    protected $primaryKey = 'SESSION_ID';

    protected $fillable = [
        'SCHOOL_ID',
        'SESSION_NAME',
        'YEAR',
        'ACTIVE',
        'REMARKS'
    ];

    public function setAttribute($key, $value)
    {
        if (
            in_array($key, $this->fillable) &&
            $key !== 'EMAIL' &&
            is_string($value)
        ) {
            $value = mb_strtoupper($value); // Use multibyte safe strtoupper
        }

        return parent::setAttribute($key, $value);
    }

    public function school(){
        return $this->belongsTo(School::class, 'SCHOOL_ID');
    }
}
