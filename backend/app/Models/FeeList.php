<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\FeeCategory;
use App\Models\Session;
use App\Models\Standard;

class FeeList extends Model
{
    protected $table = 'fee_lists';
    protected $primaryKey = 'FEE_ID';

    protected $fillable = [
        'FEE_CAT_ID',
        'SESSION_ID',
        'STANDARD_ID',
        'TITLE',
        'AMOUNT',
        'ACTIVE',
        'REMARKS'
    ];

    public function fee_category(){
        return $this->belongsTo(FeeCategory::class, 'FEE_CAT_ID');
    }

    public function session(){
        return $this->belongsTo(Session::class, 'SESSION_ID');
    }

    public function standard(){
        return $this->belongsTo(Standard::class, 'STANDARD_ID');
    }
}
