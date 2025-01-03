import { type RouterOutputs } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Bounty = RouterOutputs["bounty"]["list"]["items"][0];

export function BountyCard({ bounty }: { bounty: Bounty }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{bounty.title}</h3>
          <Badge variant={bounty.isOpen ? "success" : "secondary"}>
            {bounty.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{bounty.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Reward</p>
            <p className="font-semibold">{bounty.reward} ETH</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Submissions</p>
            <p className="font-semibold">{bounty._count.submissions}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Posted {formatDistance(bounty.createdAt)}
        </p>
        <Link href={`/bounties/${bounty.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}