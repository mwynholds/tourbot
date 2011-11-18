@javascript
Feature: Touring
  As a web site user
  I can take a tour of the web site
  So that I can reach my goal more easily

  Scenario: Visible tab
    When I view the simple demo
     And I am assigned variant A
    Then I should see the tourbot tab

  Scenario: Hidden tab
    When I view the simple demo
     And I am assigned variant B
    Then I should not see the tourbot tab

  Scenario: Start tour
    When I view the simple demo
     And I am assigned variant A
     And I start the tour
    Then I should see the first step

  Scenario: Complete a single-page tour
    When I view the simple demo
     And I am assigned variant A
     And I start the tour
    Then I should see the first step
    When I complete the first step
    Then I should see the second step
    When I complete the second step
    Then I should see the third step
    When I complete the third step
    Then The tab should close

  Scenario: Complete a multi-page tour
    When I view the multi-page demo
     And I am assigned variant A
     And I complete the second step
    Then I should be viewing page two2
     And My session id should be the same
     And My variant should be the same
    When I complete the second step
    Then The tab should close