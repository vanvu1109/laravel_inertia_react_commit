<?php
namespace App\Http\Requests\Permission\Permission;
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
            'canonical' => 'required|string|unique:permissions',
            'description' => 'sometimes|string',
        ];
    }

    public function attributes() {
       return [
            'name' => Lang::get('message.validation.name'),
            'canonical' => Lang::get('message.validation.canonical'),
            'description' => Lang::get('message.description'),
       ];
    }


}
