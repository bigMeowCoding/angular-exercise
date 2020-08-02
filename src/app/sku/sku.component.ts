import { Component, OnInit } from '@angular/core';
import { getObjKeys } from './common/utils';
import { RenderData } from './common/interface';

@Component({
  selector: 'app-sku',
  templateUrl: './sku.component.html',
  styleUrls: ['./sku.component.less'],
})
export class SkuComponent implements OnInit {
  constructor() {}
  // 属性集
  public keys = [
    ['10', '11'],
    ['20', '21'],
    ['30', '31', '32'],
  ];
  public data: RenderData = {
    gendar: [],
    quantity: [],
    weight: [],
  };
  // 数据集, 一般由后台返回
  public storage = {
    '10;20;30': { price: 1, count: 0 },
    '10;20;31': { price: 2, count: 2 },
    '10;20;32': { price: 3, count: 3 },
    '11;20;30': { price: 4, count: 4 },
    '11;20;31': { price: 5, count: 5 },
    '11;20;32': { price: 6, count: 6 },
    '10;21;30': { price: 7, count: 0 },
    '10;21;31': { price: 8, count: 8 },
    '10;21;32': { price: 9, count: 0 },
    '11;21;30': { price: 10, count: 10 },
    '11;21;31': { price: 11, count: 11 },
    '11;21;32': { price: 12, count: 0 },
  };
  // 保存最后的组合结果信息
  public SKUResult = {};
  // 把组合的key放入结果集SKUResult
  private addSKUResult(combArrItem, sku) {
    const key = combArrItem.join(';');
    if (this.SKUResult[key]) {
      // SKU信息key属性
      this.SKUResult[key].count += sku.count;
      this.SKUResult[key].prices.push(sku.price);
    } else {
      this.SKUResult[key] = {
        count: sku.count,
        prices: [sku.price],
      };
    }
  }
  // 初始化得到结果集
  private initSKU() {
    const skuKeys: string[] = getObjKeys(this.storage);
    for (const skuKey of skuKeys) {
      // var skuKey = skuKeys[i]; //一条SKU信息key
      const sku = this.storage[skuKey]; // 一条SKU信息value
      const skuKeyAttrs = skuKey.split(';'); // SKU信息key属性值数组
      skuKeyAttrs.sort((value1, value2) => {
        return parseInt(value1, 10) - parseInt(value2, 10);
      });

      // 对每个SKU信息key属性值进行拆分组合
      const combArr = this.combInArray(skuKeyAttrs);
      for (const key of combArr) {
        this.addSKUResult(key, sku);
      }
      // 结果集接放入SKUResult
      this.SKUResult[skuKeyAttrs.join(';')] = {
        count: sku.count,
        prices: [sku.price],
      };
    }
  }
  /**
   * 从数组中生成指定长度的组合
   * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
   */
  private combInArray(aData: string[]) {
    if (!aData || !aData.length) {
      return [];
    }

    const len = aData.length;
    const aResult = [];

    for (let n = 1; n < len; n++) {
      const aaFlags = this.getCombFlags(len, n);
      while (aaFlags.length) {
        const aFlag = aaFlags.shift();
        const aComb = [];
        for (let i = 0; i < len; i++) {
          if (aFlag[i]) {
            aComb.push(aData[i]);
          }
        }
        aResult.push(aComb);
      }
    }

    return aResult;
  }

  /**
   * 得到从 m 元素中取 n 元素的所有组合
   * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
   */
  private getCombFlags(m: number, n: number) {
    if (!n || n < 1) {
      return [];
    }

    const aResult = [];
    const aFlag: number[] = [];
    let bNext = true;
    let iCnt1;

    for (let i = 0; i < m; i++) {
      aFlag[i] = i < n ? 1 : 0;
    }

    aResult.push(aFlag.concat());

    while (bNext) {
      iCnt1 = 0;
      for (let i = 0; i < m - 1; i++) {
        if (aFlag[i] === 1 && aFlag[i + 1] === 0) {
          for (let j = 0; j < i; j++) {
            aFlag[j] = j < iCnt1 ? 1 : 0;
          }
          aFlag[i] = 0;
          aFlag[i + 1] = 1;
          const aTmp = aFlag.concat();
          aResult.push(aTmp);
          if (aTmp.slice(-n).join('').indexOf('0') === -1) {
            bNext = false;
          }
          break;
        }
        if (aFlag[i] === 1) {
          iCnt1++;
        }
      }
    }
    return aResult;
  }
  ngOnInit(): void {
    this.initSKU();
    console.log(this.SKUResult);

    //初始化用户选择事件
    // $(function () {
    //   initSKU();
    //   var endTime = new Date().getTime();
    //   $('#init_time').text('init sku time: ' + (endTime - startTime) + ' ms');
    //   $('.sku')
    //     .each(function () {
    //       var self = $(this);
    //       var attr_id = self.attr('attr_id');
    //       if (!SKUResult[attr_id]) {
    //         self.attr('disabled', 'disabled');
    //       }
    //     })
    //     .click(function () {
    //       var self = $(this);

    //       //选中自己，兄弟节点取消选中
    //       self
    //         .toggleClass('bh-sku-selected')
    //         .siblings()
    //         .removeClass('bh-sku-selected');

    //       //已经选择的节点
    //       var selectedObjs = $('.bh-sku-selected');

    //       if (selectedObjs.length) {
    //         //获得组合key价格
    //         var selectedIds = [];
    //         selectedObjs.each(function () {
    //           selectedIds.push($(this).attr('attr_id'));
    //         });
    //         selectedIds.sort(function (value1, value2) {
    //           return parseInt(value1) - parseInt(value2);
    //         });
    //         var len = selectedIds.length;
    //         var prices = SKUResult[selectedIds.join(';')].prices;
    //         var maxPrice = Math.max.apply(Math, prices);
    //         var minPrice = Math.min.apply(Math, prices);
    //         $('#price').text(
    //           maxPrice > minPrice ? minPrice + '-' + maxPrice : maxPrice
    //         );

    //         //用已选中的节点验证待测试节点 underTestObjs
    //         $('.sku')
    //           .not(selectedObjs)
    //           .not(self)
    //           .each(function () {
    //             var siblingsSelectedObj = $(this).siblings('.bh-sku-selected');
    //             var testAttrIds = []; //从选中节点中去掉选中的兄弟节点
    //             if (siblingsSelectedObj.length) {
    //               var siblingsSelectedObjId = siblingsSelectedObj.attr(
    //                 'attr_id'
    //               );
    //               for (var i = 0; i < len; i++) {
    //                 selectedIds[i] != siblingsSelectedObjId &&
    //                   testAttrIds.push(selectedIds[i]);
    //               }
    //             } else {
    //               testAttrIds = selectedIds.concat();
    //             }
    //             testAttrIds = testAttrIds.concat($(this).attr('attr_id'));
    //             testAttrIds.sort(function (value1, value2) {
    //               return parseInt(value1) - parseInt(value2);
    //             });
    //             var SKU = SKUResult[testAttrIds.join(';')];
    //             if (!SKU || SKU.count === 0) {
    //               $(this)
    //                 .attr('disabled', 'disabled')
    //                 .removeClass('bh-sku-selected');
    //             } else {
    //               $(this).removeAttr('disabled');
    //             }
    //           });
    //       } else {
    //         //设置默认价格
    //         $('#price').text('--');
    //         //设置属性状态
    //         $('.sku').each(function () {
    //           SKUResult[$(this).attr('attr_id')]
    //             ? $(this).removeAttr('disabled')
    //             : $(this)
    //                 .attr('disabled', 'disabled')
    //                 .removeClass('bh-sku-selected');
    //         });
    //       }
    //     });
    // });
  }
}
