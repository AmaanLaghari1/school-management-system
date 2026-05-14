<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentRegistration extends Model
{
    //
    protected $table = 'student_registrations';

    protected $primaryKey = 'REG_ID';

    protected $fillable = [
        'SCHOOL_ID',
        'SESSION_ID',
        'STANDARD_ID',
        'NAME',
        'SURNAME',
        'FNAME',
        'EMAIL',
        'MOBILE_NO',
        'DOB',
        'GENDER',
        'HOME_ADDRESS',
        'LAST_SCHOOL_ATTENDED',
        'FATHER_NAME',
        'FATHER_CNIC_NO',
        'FATHER_OCCUPATION',
        'IS_UNI_EMPLOYEE',
        'DESIGNATION',
        'DEPARTMENT',
        'GUARDIAN_RELATION',
        'GUARDIAN_NAME',
        'GUARDIAN_CNIC_NO',
        'GUARDIAN_MOBILE_NO',
        'GUARDIAN_EMAIL',
        'GUARDIAN_ADDRESS',
        'ACTIVE',
        'REMARKS',
        'STUDENT_PHOTO'
    ];

    public function siblings()
    {
        return $this->hasMany(Sibling::class, 'REG_ID', 'REG_ID');
    }

    function school(){
        return $this->belongsTo(School::class, 'SCHOOL_ID');
    }

    function session(){
        return $this->belongsTo(Session::class, 'SESSION_ID');
    }

    function standard(){
        return $this->belongsTo(Standard::class, 'STANDARD_ID');
    }
}
