<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enrolment extends Model
{
    use HasFactory, SoftDeletes;
    //
    public $table = 'enrolments';
    protected $primaryKey = 'ENROLMENT_ID';
    protected $fillable = [
        'STUDENT_ID',
        'SESSION_ID',
        'STANDARD_ID',
        'DETAIL',
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

    public function student(){
        return $this->belongsTo(Student::class, 'STUDENT_ID');
    }

    public function session(){
        return $this->belongsTo(Session::class, 'SESSION_ID')->orderBy('YEAR', 'DESC');
    }

    public function standard(){
        return $this->belongsTo(Standard::class, 'STANDARD_ID');
    }
}
