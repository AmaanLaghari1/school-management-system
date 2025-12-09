<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class GuardianRelation extends Model
{
    //
    use HasFactory, Notifiable, SoftDeletes;

    public $timestamps = false;

    public $table = 'guardian_relations';
    protected $primaryKey = 'RELATION_ID';

    protected $fillable = [
        'TITLE',
        'REMARKS'
    ];

    public function students(){
        return $this->hasMany(Student::class, 'GUARDIAN_RELATION_ID');
    }
}
