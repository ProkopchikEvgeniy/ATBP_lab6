Feature: Subscription Renewal
  As a user
  I want to manage my subscription
  So that I can continue using the service

  Background:
    Given the subscription service is running

  Scenario: TC-07 - View active subscription details
    When I request subscription for user "user1"
    Then the response status should be 200
    And the subscription status should be "active"
    And the plan should be "basic"
    And auto-renew should be true

  Scenario: TC-08 - Renew active subscription
    Given user "user2" has an active subscription
    When I renew subscription for user "user2" with 30 days
    Then the subscription should be renewed successfully

  Scenario: TC-09 - Reactivate expired subscription
    Given user "user3" has an expired subscription
    When I renew subscription for user "user3" with 30 days
    Then the subscription should be reactivated
    And the status should become "active"

  Scenario: TC-10 - Cancel subscription
    Given user "user1" has an active subscription
    When I cancel subscription for user "user1"
    Then the subscription should be cancelled
    And auto-renew should be set to false