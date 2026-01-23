<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeCategory extends Model
{
    //
    public $table = 'fee_categories';

    protected $primaryKey = 'FEE_CAT_ID';

    protected $fillable = [
      'CAT_TITLE',
      'REMARKS',
      'ACTIVE'
    ];

    public function setAttribute($key, $value)
    {
        $value = mb_strtoupper($value);

        return parent::setAttribute($key, $value);
    }
}
