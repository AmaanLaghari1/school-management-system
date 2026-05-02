<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeVoucherDetail extends Model
{
    //
    protected $table = 'voucher_details';
    protected $primaryKey = 'VOUCHER_ID';

    protected $fillable = [
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
