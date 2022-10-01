
beforeEach(() => {
  cy.visit('/')
})

describe('state', () => {

  it('changes to itemstate when Item Details is clicked', () => {
    cy.contains('Item Details').click()
    cy.get('.homeState').should('not.be.visible')
    cy.get('.searchState').should('not.be.visible')
    cy.get('.itemState').should('be.visible')
  })


  it('changes to itemstate when Item Details is clicked', () => {
    cy.contains('Item Details').click()
    cy.get('.homeState').should('not.be.visible')
    cy.get('.searchState').should('not.be.visible')
    cy.get('.itemState').should('be.visible')
  })

  it('changes to search state when search is clicked', () => {
    cy.get('#searchBtn').click()
    cy.get('.homeState').should('not.be.visible')
    cy.get('.searchState').should('be.visible')
    cy.get('.itemState').should('not.be.visible')
  })


})


describe('navbar', () => {
  it('displays website name', () => {
    //navbar contains name of the website 
    cy.get('.navbar ').contains("SellPhone").should("be.visible")

  })

  it('displays serach box', () => {
    cy.get('.navbar ').find("input[type='text']").should("be.visible")
  })

  it('displays serach button', () => {
    cy.get('.navbar ').contains("button", "Search").should("be.visible")
  })

  it('displays Sign In button', () => {
    cy.get('.navbar ').contains("button", "Sign In").should("be.visible")
  })


  it('hides Log Out button', () => {
    cy.get('.navbar ').contains("button", "Log Out").should("not.be.visible")
  })

  it('hides Profile button', () => {
    cy.get('.navbar ').contains("button", "Profile").should("not.be.visible")
  })

  it('dipslays catagory dropdown', () => {
    cy.get('.navbar ').find("select").should("be.visible")
  })

  //currently an error as it is displayed but should be hidden 
  it('hides price range bar button', () => {
    cy.get('.navbar ').find("input[type='range']").should("not.be.visible")
  })

})

describe("body",()=>{

  it('should have a Sold Out Soon Section ', () => {

    cy.contains("Sold Out Soon").should("be.visible")
  })

  it('should have at most  5 cards in Sold Out Soon Section ', () => {
    cy.get(".card[id^='sold']").its("length").should("be.lte", 5)
  })

  it('should have a Best sellers Section ', () => {
    cy.contains("Best sellers").should("be.visible")
  })

  it('should have at most  5 cards in Best sellers Section ', () => {
    cy.get(".card[id^='sellers']").its("length").should("be.lte", 5)
  })



})

describe("body mock", () => {
  //no point checking length as this is done on the backend 
  it('should have a Sold Out Soon Section Mock', () => {
    cy.intercept('GET', 'http://localhost:3000/sold-out-soon', {
      fixture: "sold-out-soon.json"
    })
    cy.visit('/')
    cy.contains("Sold Out Soon").should("be.visible")
  })

  

  it('should have a Best sellers Mock', () => {
    cy.intercept('GET', 'http://localhost:3000/best-sellers', {
      fixture: "best-sellers.json"
    })
    cy.visit('/')
    cy.contains("Best Sellers").should("be.visible")
  })


})



describe("cards", () => {
  it('displays image in cards', () => {
    cy.get("[class ='card']").each((card, index, list) => {
      cy.wrap(card).get("img").should("be.visible")
    })
  })

  it('displays price in cards', () => {
    cy.get("[class ='card']").each((card, index, list) => {
      cy.wrap(card).get(".card-title").should("be.visible")
    })
  })


  it('displays Item details button in cards', () => {
    cy.get("[class ='card']").each((card, index, list) => {
      cy.wrap(card).contains("button", "Item Details").should("be.visible")
    })
  })

})