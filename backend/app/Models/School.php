<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Standard;

class School extends Model
{
    public $timestamps = false;
    public $table = 'schools';
    protected $primaryKey = 'SCHOOL_ID';

    protected $fillable = [
        'SCHOOL_NAME',
        'BRANCH',
        'ADDRESS',
        'CONTACT_NO_1',
        'CONTACT_NO_2',
        'EMAIL',
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

    public function standards(){
        return $this->hasMany(Standard::class, 'SCHOOL_ID');
    }
}
