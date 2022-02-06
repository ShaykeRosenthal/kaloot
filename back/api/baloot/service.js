const dbService = require('../../db_service')
const ObjectId = require('mongodb').ObjectId
// const orderService = require('../order/order.service')

async function query(filterBy = {}) {
    var criteria = _buildCriteria(filterBy)
    let baloots;
    // console.log('full req obj',query.caller)
    console.log("\n\ncriteria:", criteria)
    let collection = await dbService.getCollection('baloot')
    try {
        (collection) ? console.log('collection:', true) : console.log('collection:', false);

        baloots = collection ? await collection.find(criteria).collation( { locale: 'en', strength: 2 } ).toArray() : false

        console.log("query function here, baloots: \n\n", baloots)
    } catch (err) {
        console.log('ERROR: cannot find baloots\n', err)

    }
    return baloots
}
async function remove(balootId) {
    const collection = await dbService.getCollection('baloot')
    try {
        collection ? await collection.deleteOne({ "_id": new ObjectId(balootId) }) : '';
    } catch (err) {
        console.log(`ERROR: cannot remove baloot ${balootId}`, err)

    }
}

async function add(baloot) {
    const collection = await dbService.getCollection('baloot')
    baloot.isTopRated = false;
    baloot.publishDate = Date.now()
    try {
        collection ? await collection.insertOne(baloot) : '';
        return baloot;
    } catch (err) {
        console.log(`ERROR: cannot insert baloot`, err)

    }
}

async function update(balootId, reqBody) {
    const collection = await dbService.getCollection('baloot')
    objBalootId = new ObjectId(balootId);

    try {
        var updatedBaloot = collection ? await collection.updateOne({ "_id": objBalootId }, { $set: reqBody }) : '';

        return updatedBaloot
    } catch (err) {
        console.log(`ERROR: cannot update baloot ${balootId}`, err)

    }
}

function _buildCriteria(filterBy) {
    console.log('_buildCriteria: ', filterBy)
    let criteria = []
    criteria.push({})
    if (filterBy.id !== 'undefined' && filterBy.id !== undefined) {
        console.log('_buildCriteria,filterBy.id: ', filterBy.id)
        criteria.push({ "_id": new ObjectId(filterBy.id) })
    }

    if ((!filterBy.id || (filterBy.id !== 'undefined' && filterBy.id !== undefined)) && filterBy.keywords) {
        // console.log('the keywords array:', ...filterBy.keywords)
        // (typeof (filterBy.keywords) === 'object') ? criteria.push({ 'keywords': { '$all': [...filterBy.keywords] } }) : criteria.push({ 'keywords': { '$all': [filterBy.keywords] } })
        // console.log('\n*********\n*********\n*********\ncriteria is:', criteria)
    }
    if ((!filterBy.id || (filterBy.id !== 'undefined' && filterBy.id !== undefined)) && filterBy.keywords) {
        // criteria.push({ 'balootName': filterBy.balootName })
        criteria.push({ 'keywords': { '$in': JSON.parse(filterBy.keywords) } })
        // console.log('\n*********\n*********\n*********\ncriteria is:', criteria)
    }
    if ((!filterBy.id || (filterBy.id !== 'undefined' && filterBy.id !== undefined)) && filterBy.balootName) {
        criteria.push({ 'balootName': filterBy.balootName})
        // console.log('\n*********\n*********\n*********\ncriteria is:', criteria)
    }
    if ((!filterBy.id || (filterBy.id !== 'undefined' && filterBy.id !== undefined)) && filterBy.creator) {
        criteria.push({ 'creator': filterBy.creator })
        // console.log('\n*********\n*********\n*********\ncriteria is:', criteria)
    }
    if ((!filterBy.id || (filterBy.id !== 'undefined' && filterBy.id !== undefined)) && filterBy.isTopRated) {
        criteria.push({ 'isTopRated': true })
        // console.log('\n*********\n*********\n*********\ncriteria is:', criteria)
    }
    // console.log('*********************\n*********************\nfinally criteria:\n', { "$and": criteria })
    return { "$and": criteria };
}


module.exports = {
    query,
    remove,
    add,
    update,
}