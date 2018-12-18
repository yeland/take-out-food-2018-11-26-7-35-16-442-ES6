let bestCharge = selectedItems => {
  let itemsInfo = getItemsInfo(selectedItems);
  let itemsPromotion = getPromotionPrice(itemsInfo);
  return printToString(itemsInfo, itemsPromotion);
}
let getItemsInfo = selectedItems => {
  let items = getItemsNumber(selectedItems);
  return getItemsPrice(items);
}
let getItemsNumber = selectedItems => {
  return selectedItems.map(element => {
    let threeParts = element.split(" ");
    let item = {};
    [item.id, item.amount] = [threeParts[0], parseInt(threeParts[2])];
    return item;
  });
}
let getItemsPrice = items => {
  let itemsInfo = getSinglePrice(items);
  return getManyPrice(itemsInfo);
}
let getSinglePrice = items => {
  let allItems = loadAllItems();
  return items.map(item => {
    allItems.forEach(element => {
      if (item.id == element.id) {
        [item.name, item.price] = [element.name, element.price];
      }
    })
    return item;
  })
}
let getManyPrice = itemsInfo => {
  return itemsInfo.map(item => {
    item.allPrice = item.price * item.amount;
    return item;
  });
}
let getPromotionPrice = itemsInfo => {
  let allPromotions = loadPromotions();
  let types = allPromotions.map(ele => ele.type);
  let allHalfItems = allPromotions[1].items;
  let promotionCut = computeCutPrice(itemsInfo, types[0]);
  let promotionHalf = computeHalfPrice(itemsInfo, types[1], allHalfItems);
  return comparaPromotions(promotionCut, promotionHalf);
}
let computeCutPrice = (itemsInfo, type) => {
  let promotionCut = {};
  let totalPrice = itemsInfo.reduce((preEle, ele) => preEle + ele.allPrice, 0);
  if (totalPrice >= 30) {
    [totalPrice, promotionCut.type, promotionCut.savePrice] = [totalPrice - 6, type, 6];
  } else {
    promotionCut.type = null;
  }
  promotionCut.sumPrice = totalPrice;
  return promotionCut;
}
let computeHalfPrice = (itemsInfo, type, allHalfItems) => {
  let promotionHalf = {};
  let totalPrice = itemsInfo.reduce((preEle, ele) => preEle + ele.allPrice, 0);
  let halfItems = getHalfItems(itemsInfo, allHalfItems);
  let promotionPrice = computeHalf(itemsInfo, allHalfItems);
  if (halfItems != []) {
    [promotionHalf.type, promotionHalf.halfItems] = [type, halfItems];
    [promotionHalf.sumPrice, promotionHalf.savePrice] = [promotionPrice, totalPrice - promotionPrice];
  } else {
    [promotionHalf.type, promotionHalf.sumPrice] = [null, totalPrice];
  }
  return promotionHalf;
}
let getHalfItems = (itemsInfo, allHalfItems) => {
  let items = [];
  itemsInfo.forEach(ele => {
    if (allHalfItems.includes(ele.id)) {
      items.push(ele.name);
    }
  })
  return items;
}
let computeHalf = (itemsInfo, allHalfItems) => {
  return itemsInfo.reduce((preEle, ele) => {
    if (allHalfItems.includes(ele.id)) {
      return preEle + ele.allPrice / 2;
    } else {
      return preEle + ele.allPrice;
    }
  }, 0);
}
let comparaPromotions = (cut, half) => {
  if (cut.sumPrice > half.sumPrice) {
    return half;
  } else {
    return cut;
  }
}
let printToString = (itemsInfo, promotion) => {
  return `============= 订餐明细 =============
${itemsString(itemsInfo)}
-----------------------------------
${promotionString(promotion)}
总计：${promotion.sumPrice}元
===================================`;
}
let itemsString = (itemsInfo) => {
  let stringGroup = itemsInfo.map((item) => item.name + ' x ' + item.amount + ' = ' + item.allPrice + '元');
  return stringGroup.reduce((preEle, ele) => preEle + ele + '\n', '');
}
let promotionString = (promotion) => {
  if (promotion.type == null) {
    return '';
  } else if (promotion.type == '指定菜品半价') {
    return `使用优惠: 
${promotion.type}(${halfToString(promotion.halfItems)})，省${promotion.savePrice}元
-----------------------------------`;
  } else {
    return `使用优惠:
${promotion.type}，省${promotion.savePrice}元
-----------------------------------`;
  }
}
let halfToString = (halfItems) => {
  return halfItems.reduce((preEle, ele, index, array) => {
    if (index != array.length - 1) {
      return preEle + ele + '，';
    } else {
      return preEle + ele;
    }
  }, '')
}