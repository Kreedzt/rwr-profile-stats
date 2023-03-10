import React, { useCallback, useEffect, useState } from "react";
import type { FC } from "react";
import { Link, RouteComponentProps, useNavigate } from "@reach/router";
import WarnAlert from "../../components/alert/WarnAlert";
import SuccessAlert from "../../components/alert/SuccessAlert";
import Translate from "../../models/translate_cn.json";
import Select from "../../components/input/Select";
import PrimaryButton from "../../components/button/PrimaryButton";
import RefreshButton from "../../components/refreshButton/RefreshButton";
import Input from "../../components/input/Input";
import DangerButton from "../../components/button/DangerButton";
import ProfileListItem from "../../components/list/ProfileListItem";
import { transformAll2StatsWithSort } from "../../utils/rank";
import { ProfileService } from "../../services/profile";
import { SystemService } from "../../services/system";
import { ComplexStats } from "../../models/stats";
import UpdateTime from "../../components/time/UpdateTime";
import MainFooter from "../../components/footer/MainFooter";
import DefaultButton from "../../components/button/DefaultButton";
import { message } from "antd";

type RankProps = RouteComponentProps;

const ORDER_SELECT_OPTIONS: Array<{
  label: string;
  value: keyof ComplexStats;
}> = [
  {
    label: Translate.xp,
    value: "rank_progression",
  },
  {
    label: Translate.kills,
    value: "kills",
  },
  {
    label: Translate.deaths,
    value: "deaths",
  },
  {
    label: Translate.time_played,
    value: "time_played",
  },
  {
    label: Translate["K/D"],
    value: "K/D",
  },
  {
    label: Translate.targets_destroyed,
    value: "targets_destroyed",
  },
  {
    label: Translate.vehicles_destroyed,
    value: "vehicles_destroyed",
  },
  {
    label: Translate.soldiers_healed,
    value: "soldiers_healed",
  },
  {
    label: Translate.times_got_healed,
    value: "times_got_healed",
  },
  {
    label: Translate.distance_moved,
    value: "distance_moved",
  },
];

const EnhancedTranslate = {
  ...Translate,
  time_played_display: Translate.time_played,
};

enum SortEnum {
  ASC = "asc",
  DESC = "desc",
}

const SORT_SELECT_OPTIONS: Array<{
  label: string;
  value: string;
}> = [
  {
    label: "升序",
    value: SortEnum.ASC,
  },
  {
    label: "降序",
    value: SortEnum.DESC,
  },
];

const Rank: FC<RankProps> = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectOrder, setSelectOrder] = useState<keyof ComplexStats>(
    ORDER_SELECT_OPTIONS[0].value
  );
  const [refreshTime, setRefreshTime] = useState<string>();
  const [selectSort, setSelectSort] = useState<string>(SortEnum.DESC);
  const [page, setPage] = useState<number>(1);
  const [dataList, setDataList] = useState<ComplexStats[]>([]);
  const [maxCount, setMaxCount] = useState<number>(0);

  const onOrderSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectOrder((e.target as any).value);
    },
    []
  );

  const onSortSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectSort(e.target.value);
    },
    []
  );

  const onPageInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(e.target.value ? +e.target.value : 1);
  }, []);

  const onReset = useCallback(async () => {
    try {
      setLoading(true);

      const { allList, time } = await ProfileService.queryAllCacheV2();
      setRefreshTime(time);
      await SystemService.queryRanks();

      const newDataList = transformAll2StatsWithSort(allList)
        .sort((a, b) => {
          return b.rank_progression - a.rank_progression;
        })
        .slice((page - 1) * 10, 10);

      setDataList(newDataList);

      // reset select
      setPage(1);
      setSelectOrder("rank_progression");
      setSelectSort(SortEnum.DESC);
    } catch (e) {
      console.log("onRefresh err:", e);
      console.dir(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(
    async (
      params: {
        page: number;
        selectOrder: keyof ComplexStats;
        selectSort: string;
      },
      force?: boolean
    ) => {
      const { page, selectOrder, selectSort } = params;
      try {
        setLoading(true);

        const { allList, time } = await ProfileService.queryAllCacheV2(force);
        setRefreshTime(time);
        await SystemService.queryRanks(force);

        const newDataList = transformAll2StatsWithSort(allList)
          .sort((a, b) => {
            if (selectSort === SortEnum.ASC) {
              return (a[selectOrder] as number) - (b[selectOrder] as number);
            } else {
              return (b[selectOrder] as number) - (a[selectOrder] as number);
            }
          })
          .slice((page - 1) * 10, page * 10)
          .map((r, index) => {
            return {
              ...r,
              rank: (page - 1) * 10 + index,
            };
          });

        setMaxCount(allList.length);
        setDataList(newDataList);
      } catch (e) {
        console.log("onRefresh err:", e);
        console.dir(e);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const onRefresh = useCallback(
    async (force?: boolean) => {
      await refreshData(
        {
          page,
          selectOrder,
          selectSort,
        },
        force
      );
    },
    [page, selectOrder, selectSort]
  );

  const onGotoDetail = useCallback((profileId: number) => {
    navigate(`/profile/${profileId}`);
  }, []);

  const onNext = useCallback(() => {
    setPage((prev) => {
      return prev + 1;
    });
    refreshData({
      page,
      selectOrder,
      selectSort,
    });
  }, [page, selectOrder, selectSort]);

  const onPrev = useCallback(() => {
    if (page === 1) {
      message.warn("已经是第一页了");
      return;
    }
    setPage((prev) => {
      return prev - 1;
    });
    refreshData({
      page: page - 1,
      selectOrder,
      selectSort,
    });
  }, [page]);

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <div className="flex flex-col h-screen justify-between">
      <div>
        <WarnAlert content="数据每 1 小时更新一次, 请勿频繁查询导致服务器崩溃" />
        <SuccessAlert content="可将此页面地址保存, 下次直接进入" />
        <SuccessAlert content="符号 '#' 表示排行" />

        <div className="flex justify-center md:flex-row sm:flex-col flex-wrap sm:gap-2 md:gap-x-2 p-2">
          <Link to="/" className="md:flex-none sm:flex-1 justify-end">
            <PrimaryButton>&lt; 返回主页</PrimaryButton>
          </Link>
          <RefreshButton
            className="md:flex-none sm:flex-1 justify-start"
            loading={loading}
            onRefresh={() => onRefresh(true)}
          />
        </div>

        <UpdateTime content={`更新时间：${refreshTime}`} />

        <div className="p-2 flex flex-col md:gap-y-2">
          <Select
            placeholder="选择指标"
            value={selectOrder}
            onChange={onOrderSelect}
            options={ORDER_SELECT_OPTIONS}
          />
          <Select
            placeholder="选择顺序"
            className=""
            value={selectSort}
            onChange={onSortSelect}
            options={SORT_SELECT_OPTIONS}
          />
          <Input
            placeholder="输入页码"
            type="number"
            value={page}
            onChange={onPageInput}
          />
        </div>

        <div className="p-2 flex justify-center md:gap-x-2">
          <DangerButton loading={loading} onClick={onReset}>
            重置
          </DangerButton>
          <PrimaryButton loading={loading} onClick={() => onRefresh()}>
            查询
          </PrimaryButton>
        </div>

        {/*内容区域*/}
        <div>
          <ul>
            {dataList.map((item) => (
              <li key={item.profile_id}>
                <ProfileListItem
                  onClick={() => onGotoDetail(item.profile_id)}
                  profile_id={item.profile_id}
                  username={item.username}
                  prefix={`#${item.rank + 1}`}
                  content={`${EnhancedTranslate[selectOrder]}: ${item[selectOrder]}`}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="p-2 flex justify-center gap-x-2">
          <DefaultButton loading={loading} onClick={onPrev}>
            &lt; 上一页
          </DefaultButton>
          <DefaultButton loading={loading} onClick={onNext}>
            下一页 &gt;
          </DefaultButton>
        </div>
        <div className="p-2">
          <p>
            总计: {maxCount} 份数据, 当前: {(page - 1) * 10 + 1} ~ {page * 10}
          </p>
        </div>
      </div>

      <MainFooter className="justify-end" />
    </div>
  );
};

export default Rank;
