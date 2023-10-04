import Head from "next/head";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useState } from "react";

const formSchema = z.object({
  currency: z.string(),
  grossMargins: z.coerce.number().gte(1).lte(99),
  expectedAdSpend: z.coerce.number().gte(1),
  serviceFee: z.coerce.number().gte(1),
});

export default function Home() {
  const [breakevenRevWithFee, setBreakevenRevWithFee] = useState<
    undefined | number
  >();
  const [breakevenRevNoFee, setBreakevenRevNoFee] = useState<
    undefined | number
  >();
  const [breakevenRoasWithFee, setBreakevenRoasWithFee] = useState<
    undefined | number
  >();
  const [breakevenRoasNoFee, setBreakevenRoasNoFee] = useState<
    undefined | number
  >();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "EUR",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const totSpend = data.expectedAdSpend + data.serviceFee;
    const grossMargin = data.grossMargins / 100;

    setBreakevenRevWithFee(() => {
      return totSpend / grossMargin;
    });
    setBreakevenRevNoFee(() => {
      return data.expectedAdSpend / grossMargin;
    });
    setBreakevenRoasWithFee(() => {
      return totSpend / grossMargin / data.expectedAdSpend;
    });
    setBreakevenRoasNoFee(() => {
      return data.expectedAdSpend / grossMargin / data.expectedAdSpend;
    });
  };

  return (
    <>
      <Head>
        <title>ROAS Calculator</title>
        <meta name="description" content="Simple Breakeven ROAS Calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen ">
        <div className="flex h-screen flex-1 items-center justify-center ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-end">
                    <div className="space-y-2">
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={"EUR"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="EUR" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grossMargins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Margins</FormLabel>
                    <FormControl>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <Input type="text" placeholder="50" {...field} />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          %
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedAdSpend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Ad Spend</FormLabel>
                    <FormControl>
                      <Input placeholder="100000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Fee</FormLabel>
                    <FormControl>
                      <Input placeholder="2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center space-y-8 bg-gray-200">
          <Card className="w-[350px] space-y-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Breakeven Revenue - With Fee
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Ad Spend + Fee divided by Gross Margins
                </CardDescription>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${breakevenRevWithFee}</div>
            </CardContent>
          </Card>
          <Card className="w-[350px] space-y-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Breakeven Revenue - Without Fee
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Ad Spend dividd by Gross Margins
                </CardDescription>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${breakevenRevNoFee}</div>
            </CardContent>
          </Card>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Breakeven ROAS - With Fee
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breakevenRoasWithFee}</div>
            </CardContent>
          </Card>
          <Card className="w-[350px]">
            <CardHeader>
              <div>
                <CardTitle className="text-sm font-medium">
                  Breakeven ROAS - Without Fee
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Deploy your new project in one-click.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breakevenRoasNoFee}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
