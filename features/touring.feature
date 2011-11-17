@javascript
Feature: Touring
  As a web site user
  I can take a tour of the web site
  So that I can reach my goal more easily

  Scenario: View tourbot tab
    When I go to demo one
    Then I should see the tourbot tab

  Scenario: Start tour
    When I go to demo one
     And I start the tour
    Then I should see the first step
