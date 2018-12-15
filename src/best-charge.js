function bestCharge(selectedItems) {
  let itemsInfo = getItemsInfo(selectedItems);
  let itemsPromotion = getPromotionPrice(itemsInfo);
  return printToString(itemsInfo, itemsPromotion);
}
function getItemsInfo(selectedItems) {
  let items = getItemsNumber(selectedItems);
  return getItemsPrice(items);
}
function getItemsNumber(selectedItems) {
  let items = selectedItems.map(function (element) {
    let threeParts = element.split(" ");
    let item = new Object();
    item.id = threeParts[0];
    item.amount = parseInt(threeParts[2]);
    return item;
  });
  return items;
}
function getItemsPrice(items) {
  let itemsInfo = getSinglePrice(items);
  return getManyPrice(itemsInfo);
}
function getSinglePrice(items) {
  let allItems = loadAllItems();
  let itemsInfo = items.map(function (item) {
    allItems.forEach(function (element) {
      if (item.id == element.id) {
        item.name = element.name;
        item.price = element.price;
      }
    })
    return item;
  })
  return itemsInfo;
}
function getManyPrice(itemsInfo) {
  return itemsInfo.map(function (item) {
    item.allPrice = item.price * item.amount;
    return item;
  });
}
function getPromotionPrice(itemsInfo) {
  let allPromotions = loadPromotions();
  let types = allPromotions.map(function (ele) {
    return ele.type;
  });
  let allHalfItems = allPromotions[1].items;
  let promotionCut = computeCutPrice(itemsInfo, types[0]);
  let promotionHalf = computeHalfPrice(itemsInfo, types[1], allHalfItems);
  return comparaPromotions(promotionCut, promotionHalf);
}
function computeCutPrice(itemsInfo, type) {
  let promotionCut = new Object();
  let totalPrice = itemsInfo.reduce(function (preEle, ele) {
    return preEle + ele.allPrice;
  }, 0);
  if (totalPrice >= 30) {
    totalPrice = totalPrice - 6;
    promotionCut.type = type;
    promotionCut.savePrice = 6;
  } else {
    promotionCut.type = null;
  }
  promotionCut.sumPrice = totalPrice;
  return promotionCut;
}
function computeHalfPrice(itemsInfo, type, allHalfItems) {
  let promotionHalf = new Object();
  let totalPrice = itemsInfo.reduce(function (preEle, ele) {
    return preEle + ele.allPrice;
  }, 0);
  let halfItems = new Array();
  let promotionPrice = itemsInfo.reduce(function (preEle, ele) {
    if (allHalfItems.includes(ele.id)) {
      halfItems.push(ele.name);
      return preEle + ele.allPrice / 2;
    } else {
      return preEle + ele.allPrice;
    }
  }, 0);
  if (halfItems != []) {
    promotionHalf.type = type;
    promotionHalf.halfItems = halfItems;
    promotionHalf.sumPrice = promotionPrice;
    promotionHalf.savePrice = totalPrice - promotionPrice;
  } else {
    promotionHalf.type = null;
    promotionHalf.sumPrice = totalPrice;
  }
  return promotionHalf;
}
function comparaPromotions(cut, half) {
  if (cut.sumPrice > half.sumPrice) {
    return half;
  } else {
    return cut;
  }
}
function printToString(itemsInfo, promotion) {
  let header = '============= 订餐明细 =============\n';
  let sum = '总计：' + promotion.sumPrice + '元\n';
  let dot = '-----------------------------------\n'; 
  let doubleDot = '===================================';
  let item = header + itemsString(itemsInfo) + dot + promotionString(promotion) + sum + doubleDot;

  return item;
}
function itemsString(itemsInfo) {
  let stringGroup = itemsInfo.map(function (item) {
    return item.name + ' x ' + item.amount + ' = ' + item.allPrice + '元';
  });
  let string = stringGroup.reduce(function (preEle, ele) {
    return preEle + ele + '\n';
  }, '');
  return string;
}
function promotionString(promotion) {
  let string;
  let stringItems;
  let dot = '-----------------------------------\n'; 
  if (promotion.type == '指定菜品半价') {
    stringItems = promotion.halfItems.reduce(function (preEle, ele, index, array) {
      if (index != array.length - 1) {
        return preEle + ele + '，';
      } else {
        return preEle + ele;
      }
    }, '')
  }
  if (promotion.type == null) {
    string = '';
  } else if (promotion.type == '指定菜品半价') {
    string = '使用优惠:\n' + promotion.type + '(' + stringItems + ')，省' + promotion.savePrice + '元\n' + dot;
  } else {
    string = '使用优惠:\n' + promotion.type + '，省' + promotion.savePrice + '元\n' + dot;
  }
  return string;
}
