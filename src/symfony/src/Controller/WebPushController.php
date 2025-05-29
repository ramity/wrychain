<?php

namespace App\Controller;

use App\Entity\WebPushSubscription;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\Exception\TransportException;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class WebPushController extends AbstractController
{
    private HttpClientInterface $client;
    private EntityManagerInterface $entityManager;

    public function __construct(HttpClientInterface $client, EntityManagerInterface $entityManager)
    {
        $this->client = $client;
        $this->entityManager = $entityManager;
    }

    // Forward request to notification backend
    #[Route('/subscribe', name: 'subscribe', methods: ['POST'])]
    public function subscribe(Request $request): Response
    {
        $notification_backend_subscribe_endpoint = 'http://wrychain_node:3000/subscribe';

        // Extract headers
        $headers = [];
        foreach ($request->headers->all() as $key => $values) {
            $headers[$key] = implode(', ', $values);
        }

        // Forward request to notification backend
        $response = $this->client->request('POST', $notification_backend_subscribe_endpoint, [
            'body' => $request->getContent(),
            'headers' => $headers
        ]);

        // Relay back the response
        return $this->json($response);
    }

    #[Route('/send-notification', name: 'notification')]
    public function send_notification(): Response {
        $notification_backend_subscribe_endpoint = 'http://wrychain_node:3000/send-notification';

        // Forward request to notification backend
        try {
            $response = $this->client->request('POST', $notification_backend_subscribe_endpoint);
        } catch (TransportException $error) {
            $response = $error->getMessage();
        }

        // Relay back the response
        return $this->json($response);
    }
}
