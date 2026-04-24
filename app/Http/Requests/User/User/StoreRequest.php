<?php
namespace App\Http\Requests\User\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;
class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'description' => 'sometimes|string',
            'publish' => 'sometimes|in:1,2',
            'email' => 'sometimes|email|unique:users,email',
            'birthday' => 'required|date',
            'password' => 'string|min:6',
            'password_confirm' => 'string|min:6|same:password',
            'user_catalogues' => 'required|array|min:1',
            'user_catalogues.*' => 'required|exists:user_catalogues,id',
        ];
    }

    public function attributes() {
       return [
            'name' => Lang::get('message.validation.name'),
            'description' => Lang::get('message.description'),
       ];
    }

}
