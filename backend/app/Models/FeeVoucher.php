<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Enrolment;
use App\Models\School;

class FeeVoucher extends Model
{
    protected $primaryKey = 'VOUCHER_ID';

    public $table = 'vouchers';

    public $fillable = [
        'ENROLMENT_ID',
        'SCHOOL_ID',
        'DATE',
        'FEE_MONTH',
        'TOTAL_AMOUNT',
        'ACTIVE',
        'REMARKS'
    ];

    public function enrolment(){
        return $this->belongsTo(Enrolment::class, 'ENROLMENT_ID');
    }

    public function school(){
        return $this->belongsTo(School::class, 'SCHOOL_ID');
    }
}
