<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JSONResponse;
use Symfony\Component\Routing\Attribute\Route;

final class DevToolsController extends AbstractController
{
    #[Route('/.well-known/appspecific/com.chrome.devtools.json', name: 'chrome_dev_tools')]
    public function chromeDevTools(): JsonResponse
    {
        return $this->json('{}');
    }
}
