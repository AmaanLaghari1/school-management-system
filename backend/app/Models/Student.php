<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Student extends Model
{
    //
    use HasFactory, Notifiable, SoftDeletes;

    public $timestamps = false;

    public $table = 'students';
    protected $primaryKey = 'STUDENT_ID';

    protected $fillable = [
        'SCHOOL_ID',
        'GUARDIAN_RELATION_ID',
        'NAME',
        'FNAME',
        'SURNAME',
        'EMAIL',
        'MOBILE_NO',
        'CNIC_NO',
        'GENDER',
        'POSTAL_ADDRESS',
        'PERMANENT_ADDRESS',
        'DATE_OF_BIRTH',
        'GUARDIAN_NAME',
        'GUARDIAN_MOBILE_NO',
        'GUARDIAN_EMAIL',
        'GUARDIAN_CNIC_NO',
        'GUARDIAN_ADDRESS',
        'PREVIOUS_STANDARD',
        'PREVIOUS_GR_NO',
        'CURRENT_GR_NO',
        'DATE',
        'TUITION_FEE',
        'ACTIVE',
        'REMARKS'
    ];

    public function setAttribute($key, $value)
    {
        if (
            in_array($key, $this->fillable) &&
            $key !== 'EMAIL' &&
            $key !== 'GUARDIAN_EMAIL' &&
            is_string($value)
        ) {
            $value = mb_strtoupper($value); // Use multibyte safe strtoupper
        }

        return parent::setAttribute($key, $value);
    }

    public function guardian_relation(){
        return $this->belongsTo(GuardianRelation::class, 'GUARDIAN_RELATION_ID');
    }

    public function school(){
        return $this->belongsTo(School::class, 'SCHOOL_ID');
    }

    public function guardian(){
        return $this->belongsTo(GuardianRelation::class, 'GUARDIAN_RELATION_ID');
    }

}
