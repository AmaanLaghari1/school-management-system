<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeVoucherDetail extends Model
{
    //
    protected $table = 'voucher_details';
    public $incrementing = false;
    protected $primaryKey = null;

    protected $fillable = [
        'VOUCHER_ID',
        'FEE_ID',
        'AMOUNT',
        'REMARKS'
    ];

    public function fee_list(){
        return $this->belongsTo(FeeList::class, 'FEE_ID');
    }

    public function voucher() {
        return $this->belongsTo(FeeVoucher::class, 'VOUCHER_ID');
    }
}
