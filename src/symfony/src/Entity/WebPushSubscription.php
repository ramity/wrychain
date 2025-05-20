<?php

namespace App\Entity;

use App\Repository\WebPushSubscriptionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WebPushSubscriptionRepository::class)]
class WebPushSubscription
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 1024)]
    private ?string $endpoint = null;

    #[ORM\Column(length: 255)]
    private ?string $p256dhKey = null;

    #[ORM\Column(length: 255)]
    private ?string $authToken = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEndpoint(): ?string
    {
        return $this->endpoint;
    }

    public function setEndpoint(string $endpoint): static
    {
        $this->endpoint = $endpoint;

        return $this;
    }

    public function getP256dhKey(): ?string
    {
        return $this->p256dhKey;
    }

    public function setP256dhKey(string $p256dhKey): static
    {
        $this->p256dhKey = $p256dhKey;

        return $this;
    }

    public function getAuthToken(): ?string
    {
        return $this->authToken;
    }

    public function setAuthToken(string $authToken): static
    {
        $this->authToken = $authToken;

        return $this;
    }
}
