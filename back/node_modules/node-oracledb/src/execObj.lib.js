const execObj = {
    //sql: '',
    //sqlType: '',
    params: [],
    bindParams: {},
    conditions: [],
    orderBy: [1],
    paging: undefined,
    init() {
        this.params = []
        this.bindParams = {}
        this.conditions = []
        this.orderBy = []
        this.paging = undefined
        return this
    },
    initPaging(pageNum = 1) {
        this.setPaging({ page: parseInt(pageNum) || 1 })
        return this
    },
    addParam(columnName, value, logic = 'AND', operator = '=') {
        if (columnName && value) {
            let values = new Array()

            // not array
            if (Array.isArray(value)) {
                console.log('IS ARRAY')
                values = value

                // Debug * bind arrays, array condition values
            } else {
                values.push(value)

                this.params.push({ columnName, logic, operator, values })
                this.addBindParam(columnName, values[0])
            }
        }
        return this
    },
    addBindParam(columnName, value) {
        if (columnName && value) {
            this.bindParams[columnName] = value
        }
        return this
    },
    addCondition(condition) {
        if (condition) {
            this.conditions.push(condition)
        }
        return this
    },
    addOrder(order) {
        if (order) {
            this.orderBy.push(order)
        }
        return this
    },
    // setPaging(paging) {
    //     if (paging) {
    //         this.paging = paging
    //     }
    //     return this
    // },
    createCondition() {
        let condition = ''
        if (this.params && this.params.length > 0) {
            this.params.map((param) => {
                //console.log('Param: ', param)
                if (param.values.length === 1) {
                    // One value
                    condition += ` ${param.logic} ${param.columnName} ${param.operator} :${param.columnName} `
                } else {
                    // // IN, between
                    // if (param.operator.trim().toUpperCase() === 'BETWEEN') {
                    //     condition += ` ${param.logic} ${param.columnName} ${param.operator} :${param.values[0]} and :${param.values[1]} `
                    // } else if (param.operator.trim().toUpperCase() === 'IN') {
                    //     let valueIn = ''
                    //     param.values.map((value) => {
                    //         if (value.length > 0) {
                    //             value += ','
                    //         }
                    //         valueIn += value
                    //     })
                    //     condition += ` ${param.logic} ${param.columnName} ${param.operator} (${valueIn}) `
                    // }
                }
            })
        }

        //res.logger.debug("type of condition")
        if (this.conditions && this.conditions.length > 0) {
            this.conditions.map((c) => {
                condition += c
            })
        }

        return condition
    },
    // setPage(pageNum = 1) {
    //     this.setPaging({ page: parseInt(pageNum) || 1 })
    //     return this
    // },
    setPaging({ page = 1, limit = 10, sort = [], count = 0 }) {
        let limitDefault = 10
        let limitMax = 100

        if (!page || page <= 0) {
            //console.log('Alert ! page is less than zero')
            page = 1
        }
        if (limit > 0 && limit <= limitMax) {
            limit = limit
        } else if (limit > limitMax) {
            limit = limitMax
        } else {
            limit = limitDefault
        }
        if (!sort || sort.length === 0) {
            // sort = new Array()
            // sort.push('1')
            if (this.orderBy && this.orderBy.length > 0) {
                sort = this.orderBy
            } else {
                sort = new Array()
                sort.push('1')
            }
        }
        if (!count) {
            count = 0
        }
        let row_start = (page - 1) * limit + 1
        let row_end = page * limit

        this.paging = {
            page,
            limit,
            sort,
            count,
            row_start,
            row_end,
        }
        return this.paging
    },
}

module.exports = execObj
