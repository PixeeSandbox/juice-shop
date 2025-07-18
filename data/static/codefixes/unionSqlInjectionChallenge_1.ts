module.exports = function searchProducts () {
  return (req: Request, res: Response, next: NextFunction) => {
    let criteria: any = req.query.q === 'undefined' ? '' : req.query.q ?? ''
    criteria = (criteria.length <= 200) ? criteria : criteria.substring(0, 200)
    criteria.replace(/"|'|;|and|or/i, "")
    let param = '%' + criteria + '%'; 
    models.sequelize.query(
      "SELECT * FROM Products WHERE ((name LIKE :param OR description LIKE :param) AND deletedAt IS NULL) ORDER BY name",
      { replacements: { param } }
    )
      .then(([products]: any) => {
        const dataString = JSON.stringify(products)
        for (let i = 0; i < products.length; i++) {
          products[i].name = req.__(products[i].name)
          products[i].description = req.__(products[i].description)
        }
        res.json(utils.queryResultToJson(products))
      }).catch((error: ErrorWithParent) => {
        next(error.parent)
      })
  }
}
