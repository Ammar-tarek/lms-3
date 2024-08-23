<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DatabaseController extends Controller
{
    public function connect(Request $request)
    {
        $host = $request->input('host');
        $port = $request->input('port');
        $user = $request->input('user');
        $password = $request->input('password');
        $database = $request->input('database');

        config([
            'database.connections.mysql.host' => $host,
            'database.connections.mysql.port' => $port,
            'database.connections.mysql.username' => $user,
            'database.connections.mysql.password' => $password,
            'database.connections.mysql.database' => $database,
        ]);

        try {
            DB::connection()->getPdo();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function query(Request $request)
    {
        $query = $request->input('query');

        try {
            $result = DB::select(DB::raw($query));
            return response()->json(['answer' => json_encode($result)]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
