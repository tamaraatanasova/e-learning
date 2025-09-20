<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:student,professor',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        return response()->json([
            'message' => 'User registered successfully! Please register your face.',
            'user'    => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login successful!',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ]);
    }

    public function registerFace(Request $request)
    {
        $validated = $request->validate([
            'face_embedding' => 'required|array'
        ]);

        $user = $request->user();
        $user->face_embedding = json_encode($validated['face_embedding']); // store as JSON
        $user->save();

        return response()->json([
            'message' => 'Face ID registered successfully!',
            'user'    => $user
        ]);
    }


    public function loginBiometric(Request $request)
    {
        $request->validate([
            'face_embedding' => 'required|array'
        ]);

        $loginEmbedding = $request->face_embedding;
        $users = User::whereNotNull('face_embedding')->get();
        $matchThreshold = 0.6; // safer default

        foreach ($users as $user) {
            $storedEmbedding = json_decode($user->face_embedding, true);
            if (!$storedEmbedding || count($storedEmbedding) !== count($loginEmbedding)) {
                continue;
            }

            $distance = $this->euclideanDistance($storedEmbedding, $loginEmbedding);

            if ($distance < $matchThreshold) {
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'message'      => 'Login successful!',
                    'access_token' => $token,
                    'token_type'   => 'Bearer',
                    'user'         => $user
                ]);
            }
        }

        return response()->json(['message' => 'Authentication failed. Face not recognized.'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    private function euclideanDistance(array $a, array $b): float
    {
        $sum = 0;
        for ($i = 0; $i < count($a); $i++) {
            $sum += pow($a[$i] - $b[$i], 2);
        }
        return sqrt($sum);
    }
}
