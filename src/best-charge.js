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
    return { id: threeParts[0], amount: parseInt(threeParts[2]) };
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
  let totalPrice = itemsInfo.reduce((preEle, ele) => preEle + ele.allPrice, 0);
  if (totalPrice >= 30) {
    return { sumPrice: totalPrice - 6, type, savePrice: 6 };
  }
  return { type: null, sumPrice: totalPrice };
}
let computeHalfPrice = (itemsInfo, type, allHalfItems) => {
  let totalPrice = itemsInfo.reduce((preEle, ele) => preEle + ele.allPrice, 0);
  let halfItems = getHalfItems(itemsInfo, allHalfItems);
  let promotionPrice = computeHalf(itemsInfo, allHalfItems);
  if (halfItems.length) {
    return { type, halfItems, sumPrice: promotionPrice, savePrice: totalPrice - promotionPrice };
  }
  return { type: null, sumPrice: totalPrice };
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
    }
    return preEle + ele.allPrice;
  }, 0);
}
let comparaPromotions = (cut, half) => {
  if (cut.sumPrice > half.sumPrice) {
    return half;
  }
  return cut;
}
let printToString = (itemsInfo, promotion) => {
  return `============= 订餐明细 =============
${itemsString(itemsInfo)}-----------------------------------
${promotionString(promotion)}总计：${promotion.sumPrice}元
===================================`;
}
let itemsString = (itemsInfo) => {
  let stringGroup = itemsInfo.map((item) => item.name + ' x ' + item.amount + ' = ' + item.allPrice + '元');
  return stringGroup.reduce((preEle, ele) => preEle + ele + '\n', '');
}
let promotionString = (promotion) => {
  if (!promotion.type) {
    return '';
  } else if (promotion.type == '指定菜品半价') {
    return `使用优惠:
${promotion.type}(${promotion.halfItems.join('，')})，省${promotion.savePrice}元
-----------------------------------
`;
  } else {
    return `使用优惠:
${promotion.type}，省${promotion.savePrice}元
-----------------------------------
`;
  }
}