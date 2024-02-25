import { DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY } from "@/graphql/queries";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { Card, List } from "antd";
import dayjs from "dayjs";
import LatestActivitiesSkeleton from "../skeleton/latest-activities";
import { Text } from "../text";

const DashboardLatestActivities = () => {
  const {
    data: audit,
    isLoading: isLoadingAudit,
    isError,
    error,
  } = useList({
    resource: "audits",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
    },
  });

  const dealIds = audit?.data?.map((audit) => audit?.targetId);

  const { data: deals, isLoading: isLoadingDeals } = useList({
    resource: "deals",
    queryOptions: { enabled: !!dealIds?.length },
    filters: [{ field: "id", operator: "in", value: dealIds }],
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
    },
  });

  if (isError) {
    console.log("Error");
    return null;
  }

  const isLoading = isLoadingAudit || isLoadingDeals;

  return (
    <Card
      headStyle={{ padding: "16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Latest Activities
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, i) => ({ id: i }))}
          renderItem={(_, index) => <LatestActivitiesSkeleton key={index} />}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={audit?.data}
          renderItem={(item) => {
            const deal =
              deals?.data.find((deal) => deal.id === item.targetId) ||
              undefined;

            return (
              <List.Item>
                <List.Item.Meta
                  title={dayjs(deal?.createAt).format("MMM DD, YYYY - HH:mm")}
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};

export default DashboardLatestActivities;
