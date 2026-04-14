<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Student;

class FeeLedger extends Model
{
    protected $table = 'fee_ledgers';
    protected $primaryKey = 'FEE_LEDGER_ID';

    protected $fillable = [
        'STUDENT_ID',
        'VOUCHER_ID',
        'DATE',
        'DETAIL',
        'VOUCHER_AMOUNT',
        'PAID_AMOUNT',
        'REMARKS'
    ];

    public function student(){
        return $this->belongsTo(Student::class, 'STUDENT_ID');
    }
}
