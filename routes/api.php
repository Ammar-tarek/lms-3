<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DatabaseController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\RandomStringsController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use App\Models\grade;
use App\Models\instructor;
use App\Models\wallet;
use Illuminate\Queue\Connectors\DatabaseConnector;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::apiResource('/users', UserController::class);
    Route::get('/st_in_lesson',[ UserController::class, 'st_in_lesson']);
    Route::post('/userStatus', [UserController::class, 'changeUserStatus']);
});

// request => post

// routers for login and signup
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLink']);
Route::post('/resetPassword', [AuthController::class, 'resetPassword']);



// course Done (Index, Store, showCourse, update,  )
Route::apiResource('course', CourseController::class);
Route::get('/courses/{id}', [CourseController::class, 'showCourse']);
Route::patch('/cr_toggleStatus', [CourseController::class, 'toggleStatus']);
Route::put('/upt_courses', [CourseController::class, 'update']);


// category Done
Route::apiResource('category', CategoryController::class);
// Route::apiResource('category', CategoryController::class);



// lesson Done
Route::apiResource('lesson', LessonController::class);
Route::post('/upt_lesson/{id}', [LessonController::class, 'update']);
Route::get('/instructor_Lessons', [LessonController::class, 'instructor_Lessons']);
Route::get('/viewedlessons', [LessonController::class, 'viewedlessons']);
Route::delete('/del_lesson/{lessonId}', [LessonController::class, 'destroy']);
Route::get('/viewLesson', [LessonController::class, 'viewLesson']);


// quiz Done
Route::apiResource('quiz', QuizController::class);

// quiz Done
Route::apiResource('assignment', AssignmentController::class);

// question Done
Route::apiResource('question', QuestionController::class);
Route::delete('delQuestion', [QuestionController::class, 'destroy']);


Route::apiResource('instructor', InstructorController::class);

Route::apiResource('home', HomeController::class);

Route::apiResource('wallet', WalletController::class);
Route::apiResource('transaction', TransactionController::class);
Route::apiResource('payment', PaymentController::class);
Route::apiResource('grade', GradeController::class);

// Route::get('wallet', [WalletController::class, 'index']);


Route::apiResource('RandomStrings', RandomStringsController::class);
Route::post('createRandomStrings', [RandomStringsController::class, 'createRandomStrings']);
Route::post('useRandomString', [RandomStringsController::class, 'useRandomString']);
Route::put('updateStatus', [RandomStringsController::class, 'updateRandomStringsStatus']);








