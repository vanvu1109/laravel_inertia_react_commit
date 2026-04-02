<?php
namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Enum\CommonEnum;
use Illuminate\Support\Facades\Lang;
use App\Http\Requests\ToggleRequest;
class BaseController extends Controller {

    protected $service;
    public function __construct(
        $service
    ){
        $this->service = $service;
    }


    public function handleAction($response, Request $request, string $redirectRoute = '', $editRoute = ''){
        if (!$response) {
            return redirect()->back()
                ->with('error', Lang::get('message.save_failed'));
        }

        $message = Lang::get('message.save_success');

        if ($request->input(CommonEnum::SAVE_AND_REDIRECT)) {
            return redirect()->route($redirectRoute)->with('success', $message);
        }

        if (!empty($editRoute)) {
            return to_route($editRoute, $response->id)->with('success', $message);
        }

        return redirect()->back()->with('success', $message);
    }

    public function toggle(ToggleRequest $request, $id){
        $request->merge([
            $request->input('field') => $request->input('value')
        ]);
       
        $response = $this->service->save($request, $id);
        return redirect()->back()->with('success', Lang::get('message.save_success'));
    }
}
    