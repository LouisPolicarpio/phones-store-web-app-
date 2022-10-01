
beforeEach(() => {
  cy.visit('/')
  cy.contains("button", "Search").click()
})


describe('state', () => {
  it('has the correct state', () => {
    cy.get('.homeState').should('not.be.visible')
    cy.get('.searchState').should('be.visible')
    cy.get('.itemState').should('not.be.visible')
  })

  it('changes to itemstate when Item Details is clicked', () => {
    cy.get(".searchState").contains('Item Details').click()
    cy.get('.homeState').should('not.be.visible')
    cy.get('.searchState').should('not.be.visible')
    cy.get('.itemState').should('be.visible')
  })

  it('changes to home state when title is clicked', () => {
    cy.contains("SellPhone").click()
    cy.get('.homeState').should('be.visible')
    cy.get('.searchState').should('not.be.visible')
    cy.get('.itemState').should('not.be.visible')
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


describe('cards', () => {
  it('displays image in cards', () => {
    cy.get(".searchState").find("[class ='card']").each((card, index, list) => {
      cy.wrap(card).get("img").should("be.visible")
    })
  })

  it('displays phone name in cards', () => {
    cy.get(".searchState").find("[class ='card']").each((card, index, list) => {
      cy.wrap(card).get(".card-title").should("be.visible")
    })
  })


  it('displays Item details button in cards', () => {
    cy.get(".searchState").find("[class ='card']").each((card, index, list) => {
      cy.wrap(card).contains("button", "Item Details").should("be.visible")
    })
  })

  it('displays Item details button in cards', () => {
    cy.get('.navbar ').find("input[type='text']").type("cricket")
    cy.get('.navbar ').contains("button", "Search").click()


    cy.get(".searchState").find("[class ='card']").should("have.length", 1)
    cy.get(".searchState").find("[class ='card']").get("img").should("be.visible")
    cy.get(".searchState").find("[class ='card']").contains("Cricket Samsung Galaxy Discover R740 Phone").should("be.visible")
    cy.get(".searchState").find("[class ='card']").contains("button", "Item Details").should("be.visible")

  })
})

  describe('cards serach mock', () => {




    it('displays Item card', () => {
      cy.intercept("GET", "http://localhost:3000/search?searchTerm=*&filter=*&price=*", {
        fixture: "search.json"
      })

      cy.visit('/')
      cy.contains("button", "Search").click()

      cy.get(".searchState").find("[class ='card']").get("img").should("be.visible")
      cy.get(".searchState").find("[class ='card']").contains("4G Huawei").should("be.visible")
      cy.get(".searchState").find("[class ='card']").contains("button", "Item Details").should("be.visible")
  })
})

