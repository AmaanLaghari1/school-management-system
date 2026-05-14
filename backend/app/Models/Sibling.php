<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sibling extends Model
{
    //
    protected $table = 'siblings';

    protected $primaryKey = 'SIBLING_ID';

    protected $fillable = [
        'REG_ID',
        'NAME',
        'CLASS_AND_SECTION',
        'GR_NO',
        'ACTIVE',
        'REMARKS'
    ];

    public function student_registration(){
        return $this->belongsTo(StudentRegistration::class, 'REG_ID');
    }
}
