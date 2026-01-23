<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class UserRoleRelation extends Model
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $table = 'user_role_relations';

    public $timestamps = false;

    protected $primaryKey = 'R_R_ID';

    protected $fillable = [
        'USER_ID',
        'ROLE_ID',
        'ACTIVE'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'USER_ID');
    }

    public function role(){
        return $this->belongsTo(UserRole::class, 'ROLE_ID');
    }
}
