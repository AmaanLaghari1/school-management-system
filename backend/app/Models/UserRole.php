<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserRole extends Model
{
    protected $table = 'roles';

    protected $primaryKey = 'ROLE_ID';

    protected $fillable = [
        'ROLE_NAME',
        'REMARKS',
        'ACTIVE'
    ];

    public function role_relations(){
        return $this->hasMany(UserRoleRelation::class, 'ROLE_ID');
    }
}
