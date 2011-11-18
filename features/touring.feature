@javascript
Feature: Touring
  As a web site user
  I can take a tour of the web site
  So that I can reach my goal more easily

  Scenario: Visible tab
    When I go to demo one with variant A
    Then I should see the tourbot tab

  Scenario: Hidden tab
    When I go to demo one with variant B
    Then I should not see the tourbot tab

  Scenario: Start tour
    When I go to demo one with variant A
     And I start the tour
    Then I should see the first step

  Scenario: Complete a single-page tour
    When I go to demo one with variant A
     And I start the tour
    Then I should see the first step
    When I complete the first step
    Then I should see the second step
    When I complete the second step
    Then I should see the third step
    When I complete the third step
    Then The tab should close