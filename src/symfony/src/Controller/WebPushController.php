<?php

namespace App\Controller;

use App\Entity\WebPushSubscription;
use Doctrine\ORM\EntityManagerInterface;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class WebPushController extends AbstractController
{
    private HttpClientInterface $client;
    private EntityManagerInterface $entityManager;

    public function __construct(HttpClientInterface $client, EntityManagerInterface $entityManager, WebPush $webPush)
    {
        $this->client = $client;
        $this->entityManager = $entityManager;
        $this->webPush = $webPush;
    }

    // Forward request to notification backend
    // #[Route('/subscribe', name: 'subscribe', methods: ['POST'])]
    // public function subscribe(Request $request): Response
    // {
    //     $notification_backend_subscribe_endpoint = 'http://wrychain_node:3000/subscribe';

    //     // Extract headers
    //     $headers = [];
    //     foreach ($request->headers->all() as $key => $values) {
    //         $headers[$key] = implode(', ', $values);
    //     }

    //     // Forward request to notification backend
    //     $response = $this->client->request('POST', $notification_backend_subscribe_endpoint, [
    //         'body' => $request->getContent(),
    //         'headers' => $headers
    //     ]);

    //     // Relay back the response
    //     return $this->json($response);
    // }

    // #[Route('/send-notification', name: 'notification')]
    // public function send_notification(): Response
    // {
    //     $notification_backend_subscribe_endpoint = 'http://wrychain_node:3000/send-notification';

    //     // Forward request to notification backend
    //     $response = $this->client->request('POST', $notification_backend_subscribe_endpoint);

    //     // Relay back the response
    //     return $this->json($response);
    // }

    #[Route('/subscribe', name: 'subscribe', methods: ['POST'])]
    public function subscribe(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['endpoint'], $data['keys']['p256dh'], $data['keys']['auth']))
        {
            return new JsonResponse(['error' => 'Invalid subscription data'], 400);
        }

        $subscription = new WebPushSubscription();
        $subscription->setEndpoint($data['endpoint']);
        $subscription->setP256dhKey($data['keys']['p256dh']);
        $subscription->setAuthToken($data['keys']['auth']);

        $this->entityManager->persist($subscription);
        $this->entityManager->flush();

        return new JsonResponse(['success' => true]);
    }

    #[Route('/send-notification', name: 'notification')]
    public function send_notification(): Response
    {
        $reports = [];
        $webPushSubscriptions = $this->entityManager->getRepository(WebPushSubscription::class)->findAll();

        foreach ($webPushSubscriptions as $webPushSubscription)
        {
            $subscription = Subscription::create([
                'endpoint' => $webPushSubscription->getEndpoint(),
                'publicKey' => $webPushSubscription->getP256dhKey(),
                'authToken' => $webPushSubscription->getAuthToken(),
                // 'contentEncoding' => 'aesgcm',
            ]);

            $report = $this->webPush->sendOneNotification($subscription, 'Test notification from Symfony!');
            array_push($reports, $report);
        }

        return new JsonResponse([
            'reports' => $reports,
        ]);
    }
}
