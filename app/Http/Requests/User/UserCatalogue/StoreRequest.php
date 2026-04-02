<?php
namespace App\Http\Requests\User\UserCatalogue;
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
            'canonical' => 'required|string|unique:user_catalogues',
            'description' => 'sometimes|string',
        ];
    }

    public function attributes() {
       return [
            'name' => Lang::get('message.user_catalogue.name'),
            'canonical' => Lang::get('message.user_catalogue.canonical'),
            'description' => Lang::get('message.description'),
       ];
    }

    protected function prepareForValidation() {
        $this->merge([
            'canonical' => Str::slug($this->input('canonical')),
        ]);
    }
}
