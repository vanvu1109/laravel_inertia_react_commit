<?php
namespace App\Http\Requests\Setting\Language;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Lang;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
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
     //Rule::unique('languages')->ignore($this->route('snake_module')),
     */
    public function rules(): array
    {
        $method = $this->getMethod();
        $sometimes = $method == 'PATCH' ? 'sometimes' : '';

        return [
            'name' => "required|string|$sometimes",
            'canonical' => [
                $sometimes,
                'required',
                'unique:languages',
                'string',
                Rule::unique('languages')->ignore($this->route('language')),
            ],
            'description' => 'sometimes|string',
            'publish' => 'sometimes|in:1,2',
        ];
    }

    public function attributes() {
       return [
            'name' => Lang::get('message.validation.name'),
            'canonical' => Lang::get('message.validation.canonical'),
            'description' => Lang::get('message.validation.description'),
            'publish' => Lang::get('message.validation.publish'),
            'image' => Lang::get('message.validation.image'),
       ];
    }
}
