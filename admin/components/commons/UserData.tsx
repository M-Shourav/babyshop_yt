"use client";
import { serverUrl } from "@/config";
import { UserType } from "@/types/userType";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import EditUser from "@/components/commons/EditUser";
import Loading from "./Loading";

const UserData = () => {
  const [userData, setUserData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/auth/profile`, {
        withCredentials: true,
      });
      const data = res?.data;
      if (data?.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.log("Failed fetching userData:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableCaption>A list of recent user</TableCaption>
              <TableHeader className="w-full">
                <TableRow>
                  <TableHead className="hidden md:table-cell">Id</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead className="hidden md:table-cell">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData?.map((item, index) => (
                  <TableRow key={item?._id}>
                    <TableCell className="hidden md:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {item?.avatar && (
                        <Image
                          src={item?.avatar.url}
                          alt={item?.avatar.public_id}
                          width={50}
                          height={50}
                          className="w-12 h-12 object-fill rounded-xs"
                        />
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item?.name}
                    </TableCell>
                    <TableCell>{item?.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item?.role}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-52 mr-4 md:mr-0 p-0"
                          side="bottom"
                        >
                          <Command className="w-full">
                            <CommandList>
                              <CommandGroup>
                                <CommandItem className="px-1">
                                  <EditUser user={item} onupdate={fetchData} />
                                </CommandItem>
                                <CommandItem className="px-1">
                                  <Button
                                    variant="ghost"
                                    className="w-full text-sm justify-start p-2"
                                  >
                                    Delete
                                  </Button>
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserData;
