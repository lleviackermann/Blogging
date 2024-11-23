"use client"
import PrimaryModal from "@/components/modals/PrimaryModal";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import PrimaryLoader from "@/components/loaders/PrimaryLoader";
import { Car } from "@/types/cars/index.type";
import CarCard from "@/components/cards/CarCard";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import CarForm from "../../components/CarForm";
import { useAppSelector } from "@/store/hooks";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addTaskVisible, setAddTaskVisible] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const toast = useToast();
  const user = useAppSelector((state) => state.user);
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/cars", { params: { user: user._id, page: searchParams.get("page") || 1, limit: searchParams.get("limit") || 20, search: searchParams.get("search") || undefined } });
      setCars([...response.data.data]);
      setTotalPages(response.data.totalPages);
      toast.toast({ title: response.data.message });
    } catch (err: any) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.toast({ title: err.response.data.message, variant: "destructive" })
      } else {
        toast.toast({ title: "Network Error / Server Down", variant: "destructive" })
      }
    } finally {
      setLoading(false);
    }
  }

  const onAddCar = (car: Car) => {
    setCars((prev) => [...prev, car]);
    setAddTaskVisible(false);
  }

  const onEditCar = (car: Car) => {
    setCars((prev) => prev.map(hold => { return (hold._id === car._id ? { ...car } : { ...hold }) }));
  }

  const onDelete = async (_id: string) => {
    setCars((prev) => prev.filter((car) => car._id != _id));
  }

  const handleSearch = (e?: React.SyntheticEvent) => {
    e?.preventDefault?.();
    let urlSearchParams = new URLSearchParams()
    urlSearchParams.set("page", searchParams.get("page") || "1");
    urlSearchParams.set("limit", searchParams.get("limit") || "20");
    urlSearchParams.set("search", searchText);
    router.push("/profile/cars/?" + urlSearchParams.toString());
  }

  useEffect(() => {
    if (searchText === "") {
      handleSearch();
    }
  }, [searchText]);

  useEffect(() => {
    fetchCars();
  }, [searchParams])

  return (
    <div className="flex-1 px-10 w-full bg-black self-center flex flex-col pb-4">
      {
        loading
          ?
          <div className="flex-1 flex justify-center items-center">
            <PrimaryLoader />
          </div>
          :
          <div className="flex flex-col flex-1">
            <div className="flex flex-row justify-between py-6 gap-4">
              <form onSubmit={handleSearch} className="w-full">
                <Input 
                  value={searchText} 
                  onChange={(e) => setSearchText(e.target.value)} 
                  type="search" 
                  placeholder="Search Car based on title, description and tags" 
                  className="max-w-[400px]" 
                />      
              </form>

              <PrimaryModal
                icon={<CirclePlus className="w-5 h-5" />}
                title="Create Car"
                description="Fill the details of your new car"
                open={addTaskVisible}
                setOpen={setAddTaskVisible}
                label="Add Car"
              >
                <CarForm type="create" onFinish={onAddCar} />
              </PrimaryModal>
            </div>
            {
              !cars || cars.length === 0
                ?
                <div className="flex-1 flex justify-center items-center text-center">
                  <div className="flex flex-col gap-2">
                    <p>
                      No Cars Found
                    </p>
                    <p>Press on <CirclePlus className="inline-block w-5 h-5" /> icon to add cars</p>
                  </div>
                </div>
                :
                <div className="flex flex-col gap-8 flex-1">
                  <div className="flex-1">
                    <div className="flex flex-row flex-wrap justify-center gap-10 max-h-min flex-grow">
                      {cars.map((car) => (
                        <CarCard
                          {...car}
                          key={car._id}
                          onEdit={onEditCar}
                          onDelete={onDelete}
                          className="w-[250px]"
                          aspectRatio="square"
                          width={250}
                          height={330}
                          showUpdateOptions={true}
                        />
                      ))}
                    </div>
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href={`/profile/cars/?page=${Math.max(Number(searchParams.get("page")) - 1, 1)}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`} />
                      </PaginationItem>
                      {
                        Number(searchParams.get("page")) - 1 > 0
                        ?
                        <PaginationItem>
                          <PaginationLink href={`/profile/cars/?page=${Number(searchParams.get("page")) - 1}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`}>{Number(searchParams.get("page")) - 1}</PaginationLink>
                        </PaginationItem>
                        :
                        null
                      }
                      <PaginationItem>
                        <PaginationLink isActive href={`/profile/cars/?page=${Number(searchParams.get("page"))}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`}>{Number(searchParams.get("page"))}</PaginationLink>
                      </PaginationItem>
                      {
                        Number(searchParams.get("page")) + 1 <= totalPages
                        ?
                        <PaginationItem>
                          <PaginationLink href={`/profile/cars/?page=${Number(searchParams.get("page")) + 1}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`}>{Number(searchParams.get("page")) + 1}</PaginationLink>
                        </PaginationItem>
                        :
                        null
                      }
                      <PaginationItem>
                        <PaginationNext 
                          href={`/profile/cars/?page=${Math.min(Number(searchParams.get("page")) + 1, totalPages)}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
            }
          </div>
      }
    </div>
  );
}

export default Cars;