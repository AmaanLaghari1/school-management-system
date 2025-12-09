<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Standard extends Model
{
    //
    public $timestamps = false;

    public $table = 'standards';

    protected $primaryKey = 'STANDARD_ID';

    protected $fillable = [
        'SCHOOL_ID',
        'STANDARD_NAME',
        'SECTION',
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
