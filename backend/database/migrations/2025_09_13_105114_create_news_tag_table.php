<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pivot табела за поврзување на news и tags
        Schema::create('news_tag', function (Blueprint $table) {
            $table->foreignId('news_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');

            // Го поставуваме парот (news_id, tag_id) како примарен клуч 
            // за да спречиме дупликат записи
            $table->primary(['news_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_tag');
    }
};
