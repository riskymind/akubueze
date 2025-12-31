'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';

const ProfileForm = () => {
  const { data: session, update } = useSession();


  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
      image: session?.user?.image ?? ''
    },
  });

   const image = useWatch({control: form.control, name: 'image'});
   const imageSrc = image || '/images/logo.jpeg';


  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    // const res = await updateProfile(values);
    const res = await updateProfile({
      ...values,
      image,
    });

    if (!res.success) {
      return toast.error(res.message)
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
        image
      },
    };

    await update(newSession);

    toast.success(res.message)
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-5'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='image'
            render={() => (
              <FormItem className='w-full'>
                <div className='upload-field flex items-center justify-start space-x-2'>
                        <Image
                          src={imageSrc}
                          alt='image'
                          className='w-20 h-20 object-cover object-center rounded-sm'
                          width={100}
                          height={100}
                        />
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('image', res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(error.message)
                          }}
                        />
                      </FormControl>
                    </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    disabled
                    placeholder='Email'
                    className='input-field'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                  disabled
                    placeholder='Name'
                    className='input-field'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          size='lg'
          className='button col-span-2 w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
