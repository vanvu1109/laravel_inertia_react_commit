<?php
namespace App\Http\Requests\Setting\Language;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Lang;
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
            'canonical' => 'required|string|unique:languages',
            'description' => 'sometimes|string',
            'image' => 'required|string',
            'publidsh'=> 'sometimes|in:1,2',
        ];
    }

    public function attributes() {
       return [
            'name' => Lang::get('message.validation.name'),
            'canonical' => Lang::get('message.validation.canonical'),
            'description' => Lang::get('message.description'),
            'image' => Lang::get('message.validation.image'),
            'publish' => Lang::get('message.validation.publish'),
       ];
    }

}
